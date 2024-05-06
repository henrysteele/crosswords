
import './App.css'
import { testData, htmlTable } from './script.js'
import { onMount } from 'solid-js'
import Typo from "typo-js"


var dictionary = new Typo("en_US", false, false, { dictionaryPath: "/node_modules/typo-js/dictionaries" })
var is_spelled_correctly = dictionary.check("mispelled");
var array_of_suggestions = dictionary.suggest("d-g", 20);

const listOfWords = Object.keys(dictionary.dictionaryTable)

console.log({ is_spelled_correctly, array_of_suggestions, listOfWords })


function App () {

  return (
    <>
      <For each={testData}>{
        (item) => <div class="crossword" innerHTML={htmlTable(item.matrix)} />
      }</For>
    </>
  )
}

export default App
