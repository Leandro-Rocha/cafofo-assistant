import axios from "axios"


export default abstract class Service {
    abstract getEndpoint(): string

    public async get(path: string) {
        try {
            return await axios.get(this.getEndpoint() + path)
        }
        catch (err) {
            console.error(err)
            throw `Tem algo errado com o serviço de tarefas ='[`
        }

    }
}


