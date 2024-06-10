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
const [activePos, setActivePos] = createSignal()

function getPeers (pos) {
    if (!pos) return []
    if (matrix[pos.r][pos.c] == 1) return []

    const peers = []

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

    p.rc = `r${r}c${c}`
    p.peers = getPeers(pos)
    p.label = findLabel(pos)

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

function findPos (n) {
    const len = labelMatrix.length
    for (let r = 0; r < len; r++)
        for (let c = 0; c < len; c++)
            if (labelMatrix[r][c] == n) return { r, c }
}

function Hints (props) {

    function onClick (n) {
        setActivePos(assessPos(findPos(n)))
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


function findLabel (pos) {
    if (!pos) return
    if (!labelMatrix) return

    let label = false
    if (pos.horizontalWord) {
        for (let c = pos.c; c >= 0; c--) {
            if (matrix[pos.r][c] == 1) return label
            const temp = labelMatrix[pos.r][c]
            if (temp) label = temp
        }
    }
    if (pos.verticalWord) {
        for (let r = pos.r; r >= 0; r--) {
            if (matrix[r][pos.c] == 1) return label
            const temp = labelMatrix[r][pos.c]
            if (temp) label = temp
        }
    }
    return label
}

function Cell (props) {

    const blank = [1, 2, 3, "1", "2", "3"].includes(props.value)
    const [value, setValue] = createSignal(props.value)
    const [label, setLabel] = createSignal("")
    const [hint, setHint] = createSignal(<></>)
    const [style, setStyle] = createSignal({})
    const [pos, setPos] = createSignal(props.pos)

    onMount(() => {

        setPos(assessPos(pos()))

        let n = labelMatrix[pos().r][pos().c]
        if (n) setLabel(n)
        else n = findLabel(pos())

        let across = hints.across[n]?.hint
        let down = hints.down[n]?.hint

        setHint(<>
            <Show when={across && pos().horizontalWord}>
                <h4 style={{ margin: 0 }}>{n} across</h4>
                {across}
            </Show>
            <Show when={down && pos().verticalWord}>
                <h4 style={{ margin: 0 }}>{n} down</h4>
                {down}
            </Show>
        </>)

    })


    createEffect(() => {
        if (!activePos() || !activePos().peers) return
        if (!pos() || !pos().rc) return
        const style = activePos().peers.includes(pos().rc) ? { opacity: 1 } : { opacity: .5 }
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
        setActivePos(pos())
        showTip(findLabel(pos))
    }

    function isActive () {
        if (!activePos()) return false
        if (!pos()) return false
        return activePos().r == pos().r && activePos().c == pos().c
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
                    open={isActive()}
                    anchorEl={document.getElementById(findLabel(assessPos(pos())))}
                    placement={"top-start"}
                >
                    <Card sx={{ padding: "0.5em", margin: "0.5em" }}>{hint()}</Card>
                </Popper>
            </Show>
        </td>


    </>
}