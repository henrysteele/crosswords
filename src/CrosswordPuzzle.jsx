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

function createLabelMatrix (matrix) {
    const len = matrix.length
    const labels = newMatrix(len)
    const transposedMatrix = transpose(cloneMatrix(matrix))

    let count = 1
    for (let r = 0; r < len; r++) {
        for (let c = 0; c < len; c++) {
            if (matrix[r][c] == 1) continue // not a letter

            // we're looking for a letter with a 1 to the left or above and another letter to the right or below
            const left = c ? matrix[r][c - 1] == 1 : true
            const right = c < len - 1 ? matrix[r][c + 1] == 1 : true
            const above = r ? matrix[r - 1][c] == 1 : true
            const below = r < len - 1 ? matrix[r + 1][c] == 1 : true
            const across = left && !right
            const down = above && !below

            const startOfWord = across || down
            if (startOfWord) {
                labels[r][c] = count
                if (across) {
                    const word = matrix[r].slice(c).join("").split("1")[0]
                    words.across[count] = { word, hint: "" }
                }
                if (down) {
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
    labelMatrix = createLabelMatrix(matrix)

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
    const { pos } = props
    const blank = [1, 2, 3, "1", "2", "3"].includes(props.value)
    const [value, setValue] = createSignal(props.value)
    const [label, setLabel] = createSignal()
    const [hint, setHint] = createSignal()

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
    })

    function onKeyDown (e) {
        if (e.key.length > 1) return
        if (/[ a-zA-Z]/.test(e.key)) {
            setValue(e.key)
            usersMatrix[pos.r][pos.c] = e.key
            setDone(sameMatrix(matrix, usersMatrix))
        }
    }

    return <>

        <td class={blank ? "black" : "white"}>
            <Show when={!blank}>
                <Show when={label()}><div class="label">{label()}</div></Show>
                <input id={label() || ""} minLength={1} maxLength={1} value={value()} onKeyDown={onKeyDown} />
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