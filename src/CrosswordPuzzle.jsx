import { newMatrix, sameMatrix, transpose, cloneMatrix } from './matrix'
import { For, createSignal, createEffect, onMount } from "solid-js"
import { logger } from './App'
import prompt from "./ai"
import { Button, Container, Stack, Popper, Card } from "@suid/material";

let matrix, usersMatrix, labelMatrix
const words = { across: {}, down: {} }

const hints = prompt()
const keys = { across: Object.keys(hints.across), down: Object.keys(hints.down) }
console.log({ keys })

const [done, setDone] = createSignal(false)
const [tip, showTip] = createSignal()

function getPeers (pos) {

    pos = assessPos(pos)

    const peers = []

    if (!pos) return peers
    if (matrix[pos.r][pos.c] == 1) return peers


    if (pos.horizontalWord) {
        // peers to the left
        let r = pos.r
        for (let c = pos.c; c >= 0; c--) {
            if (matrix[r][c] == 1) break;
            peers.push({ r, c })
        }

        // peers to the right
        for (let c = pos.c; c < matrix.length; c++) {
            if (matrix[r][c] == 1) break;
            peers.push({ r, c })
        }
    }

    if (pos.verticalWord) {
        // peers above
        let c = pos.c
        for (let r = pos.r; r >= 0; r--) {
            if (matrix[r][c] == 1) break;
            peers.push({ r, c })
        }

        // peers below
        for (let r = pos.r; r < matrix.length; r++) {
            if (matrix[r][c] == 1) break;
            peers.push({ r, c })
        }
    }

    return [... new Set(peers.map(p => `r${p.r}c${p.c}`))].sort((a, b) => a.localeCompare(b))
}

function assessPos (pos) {
    if (!matrix || !pos) return pos
    if (pos.r == undefined || pos.c == undefined) return pos
    const p = pos
    const len = matrix.length
    let { r, c } = pos

    // is there a 1 to the left or right?
    p.oneLeft = c ? matrix[r][c - 1] == 1 : true
    p.oneRight = c < len - 1 ? matrix[r][c + 1] == 1 : true
    p.horizontalWord = !p.oneLeft || !p.oneRight

    // is there a 1 above or below?
    p.oneAbove = r ? matrix[r - 1][c] == 1 : true
    p.oneBelow = r < len - 1 ? matrix[r + 1][c] == 1 : true
    p.verticalWord = !p.oneAbove || !p.oneBelow

    // start of word?
    p.startAcross = p.oneLeft && !p.oneRight  // is there a 1 to the left and a word to the right?
    p.startDown = p.oneAbove && !p.oneBelow  // is there a 1 above and not below
    p.startOfWord = p.startAcross || p.startDown

    return p
}

function createLabels (matrix) {
    const len = matrix.length
    const labels = newMatrix(len)
    const transposedMatrix = transpose(cloneMatrix(matrix))

    let count = 1
    for (let r = 0; r < len; r++) {
        for (let c = 0; c < len; c++) {
            if (matrix[r][c] == 1) continue // not a letter
            const p = assessPos({ r, c })
            if (p.startOfWord) {
                labels[r][c] = count
                if (p.startAcross) {
                    const word = matrix[r].slice(c).join("").split("1")[0]
                    words.across[count] = { word, hint: "" }
                }
                if (p.startDown) {
                    const word = transposedMatrix[c].slice(r).join("").split("1")[0]
                    words.down[count] = { word, hint: "" }
                }
                count++
            }
        }
    }
    logger({ createlabels: labels, words })
    return labels
}

export default function CrosswordPuzzle (props) {
    matrix = props.value
    usersMatrix = newMatrix(matrix.length, matrix.length, "1")
    labelMatrix = createLabels(matrix)

    return <>
        <Stack orientation="horizontal">
            <div>
                <table>
                    <tbody>
                        <For each={props.value}>{
                            (item, row) => <tr><Row value={item} row={row()} /></tr>
                        }</For>
                    </tbody>
                </table>
            </div>
            <Hints value={props.value} />
        </Stack>
    </>
}


function Hints (props) {

    function onClick (n) {
        showTip(n)
        const element = document.getElementById(n)
        element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        element.focus()
    }

    return <>
        <div id="hints">
            <Show when={done()}>Yay!</Show>
            <Stack orientation="horizontal">
                <div>
                    <h3>Across</h3>
                    <ol>
                        <For each={keys.across}>{
                            (n) => <a onClick={() => { onClick(n) }}><li value={n}>{hints.across[n].hint}</li></a>
                        }</For>
                    </ol>
                </div>
                <div>
                    <h3>Down</h3>
                    <ol>
                        <For each={keys.down}>{
                            (n) => <a onClick={() => { onClick(n) }}><li value={n}>{hints.down[n].hint}</li></a>
                        }</For>
                    </ol>
                </div>
            </Stack>
        </div>
    </>
}

function Row (props) {
    return <>
        <For each={props.value}>{
            (item, col) => <Cell value={item} pos={{ r: props.row, c: col() }} />
        }</For>
    </>
}


function Cell (props) {
    let { pos } = props
    const blank = [1, 2, 3, "1", "2", "3"].includes(props.value)
    const [value, setValue] = createSignal(props.value)
    const [label, setLabel] = createSignal("")
    const [hint, setHint] = createSignal(<></>)
    const [style, setStyle] = createSignal({})
    const [peers, setPeers] = createSignal([])

    onMount(() => {
        setLabel(labelMatrix[pos.r][pos.c])
        const across = hints.across[label()]?.hint
        const down = hints.down[label()]?.hint

        setHint(<>
            <Show when={across}>
                <h4 style={{ margin: 0 }}>{label()} across</h4>
                {across}
            </Show>
            <Show when={down}>
                <h4 style={{ margin: 0 }}>{label()} down</h4>
                {down}
            </Show>
        </>)
        pos = assessPos(pos)
        setPeers(getPeers(pos))
    })

    function findPos (n) {
        const len = labelMatrix.length
        for (let r = 0; r < len; r++)
            for (let c = 0; c < len; c++)
                if (labelMatrix[r][c] == n) return { r, c }
    }

    function findLabel (pos) {
        if (pos.startOfWord == undefined) pos = assessPos(pos)
        const { r, c } = pos
        const m = matrix

        if (pos.horizontalWord) {
            for (let c = pos.c; c >= 0; c--) {
                if (matrix[r][c] == 1) break
                const label = labelMatrix[r][c]
                if (label) return label
            }
        }

        if (pos.verticalWord) {
            for (let r = pos.r; r >= 0; r--) {
                if (matrix[r][c] == 1) break
                const label = labelMatrix[r][c]
                if (label) return label
            }
        }
        return false
    }

    createEffect(() => {
        if (!peers().length) return
        if (!tip()) return
        const { r, c } = findPos(tip())
        const rc = `r${r}c${c}`
        const style = peers().includes(rc) ? { opacity: 1 } : { opacity: .5 }
        setStyle(style)
    })

    function onKeyDown (e) {
        if (e.key.length > 1) return
        if (/[ a-zA-Z]/.test(e.key)) {
            setValue(e.key)
            usersMatrix[pos.r][pos.c] = e.key
            setDone(sameMatrix(matrix, usersMatrix))
        }
    }

    function onClick () {
        pos = (assessPos(pos))
        setPeers(getPeers(pos))
        const n = findLabel(pos)
        showTip(n)
    }

    return <>

        <td>
            <Show when={!blank}>
                <Show when={label()}><div class="label">{label()}</div></Show>
                <input id={label() || ""} minLength={1} maxLength={1} value={value()}
                    onKeyDown={onKeyDown}
                    onClick={onClick}
                    style={style()}
                />
                <Popper
                    open={label() == tip()}
                    anchorEl={document.getElementById(label())}
                    placement={"top-start"}
                >
                    <Card sx={{ padding: "0.5em", margin: "0.5em" }}>{hint()}</Card>
                </Popper>
            </Show>
        </td>


    </>
}