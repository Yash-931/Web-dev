import { Center } from "./Center"

export function AuthBanner() {
    return <div style={{minHeight: "100vh", display: 'flex', backgroundColor: "black", color: "white", alignItems: "center"}}>
        <div style={{width: "100%"}}>
            <Center>
                <img style={{width: 100, height: 100}} src="https://images.icon-icons.com/2429/PNG/512/trello_logo_icon_147221.png"/>
            </Center>

            <Center>
                <div style={{fontFamily:"inter", textAlign: 'center',fontWeight: '400', fontSize:'25px',padding: '10px', display: 'flex', justifyContent: 'center'}}>Build a board, get the job done faster than anyone else</div>
            </Center>

        </div>
    </div>
}