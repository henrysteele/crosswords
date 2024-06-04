import { newMatrix, sameMatrix, transpose, cloneMatrix } from './matrix'
import { For, createSignal } from "solid-js"
import { logger } from './App'

let matrix, usersMatrix, labelMatrix
const horizontalWords = {}, verticalWords = {}

const [done, setDone] = createSignal(false)

function createLabelMatrix (matrix) {
    const len = matrix.length
    const labels = newMatrix(len, len, { across: false, down: false })
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
            labels[r][c] = { across: across && count, down: down && count }

            const startOfWord = across || down
            if (startOfWord) {
                if (across) {
                    const word = matrix[r].slice(c).join("").split("1")[0]
                    horizontalWords[count] = word
                }
                if (down) {
                    const word = transposedMatrix[c].slice(r).join("").split("1")[0]
                    verticalWords[count] = word
                }
                count++
            }
        }
    }
    logger({ createlabels: labels, horizontalWords, verticalWords })
    return labels
}

export default function CrosswordPuzzle (props) {
    matrix = props.value
    usersMatrix = newMatrix(matrix.length, matrix.length, "1")
    labelMatrix = createLabelMatrix(matrix)

    return <>
        <table>
            <tbody>
                <For each={props.value}>{
                    (item, row) => <tr><Row value={item} row={row()} /></tr>
                }</For>
            </tbody>
        </table>
        <Show when={done()}>Yay!</Show>
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

    function onKeyDown (e) {
        if (e.key.length > 1) return
        if (/[ a-zA-Z]/.test(e.key)) {
            setValue(e.key)
            usersMatrix[pos.r][pos.c] = e.key
            setDone(sameMatrix(matrix, usersMatrix))
        }
    }

    const labelRecord = labelMatrix[pos.r][pos.c]
    const label = labelRecord.across || labelRecord.down

    return <td class={blank ? "black" : "white"}>
        <Show when={!blank}>
            <Show when={label}><div class="label">{label}</div></Show>
            <input minLength={1} maxLength={1} value={value()} onKeyDown={onKeyDown} />
        </Show>
    </td>
}