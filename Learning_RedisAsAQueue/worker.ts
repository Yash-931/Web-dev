import { sleep } from "bun";
import { createClient } from "redis";

const client = await createClient()
    .on("error", (err) => console.log("error in creating the redis client " + err))
    .connect()


while(1){
    const response = await client.rPop("problems")
    if(response){
        console.log("popped item: " + response)
    } else{
        await sleep(5000)
    }
}