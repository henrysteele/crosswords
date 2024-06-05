import { newMatrix, sameMatrix, transpose, cloneMatrix } from './matrix'
import { For, createSignal, createEffect } from "solid-js"
import { logger } from './App'
import prompt from "./ai"
import { Button, Container, Stack, Popover, Card } from "@suid/material";

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
        debugger
        showTip(n)
    }

    return <>
        <div id="hints">
            <Show when={done()}>Yay!</Show>
            <Stack orientation="horizontal">
                <div>
                    <h3>Across</h3>
                    <ol>
                        <For each={keys.across}>{
                            (n) => <a href={'#' + n} onClick={() => { onClick('' + n) }}><li value={n}>{hints.across[n].hint}</li></a>
                        }</For>
                    </ol>
                </div>
                <div>
                    <h3>Down</h3>
                    <ol>
                        <For each={keys.down}>{
                            (n) => <a href={'#' + n} onClick={() => { onClick('' + n) }}><li value={n}>{hints.down[n].hint}</li></a>
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

    const label = labelMatrix[pos.r][pos.c]
    const hint = hints.across[label]?.hint || hints.down[label]?.hint || ""

    function onKeyDown (e) {
        if (e.key.length > 1) return
        if (/[ a-zA-Z]/.test(e.key)) {
            setValue(e.key)
            usersMatrix[pos.r][pos.c] = e.key
            setDone(sameMatrix(matrix, usersMatrix))
        }
    }

    return <td class={blank ? "black" : "white"}>
        <Show when={!blank}>
            <Popover
                open={Boolean(label == tip())}
                anchorEl={() => {
                    return document.getElementById(label)
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Card>{hint}</Card>
            </Popover>

            <Show when={label}><div class="label">{label}</div></Show>
            <input id={label || ""} minLength={1} maxLength={1} value={value()} onKeyDown={onKeyDown} />

        </Show>
    </td>
}