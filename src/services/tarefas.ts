import axios from "axios"

export namespace Tarefas {
    export function loucaDeHoje() {
        return `Quem lava a louça hoje é: `
    }

    export async function listTarefas() {
        const tarefasCall = await axios.get('http://localhost:21992/tarefas')

        console.log(tarefasCall)
        return tarefasCall.data
    }
}