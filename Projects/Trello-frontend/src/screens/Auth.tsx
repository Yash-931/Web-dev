import { AuthBanner } from '../components/AuthBanner' 
import { AuthCredentials } from '../components/AuthCredentials' 

export function Auth() {
    return <div style={{display: 'flex'}}>
        <div style={{flex: 4, backgroundColor: 'black', minHeight: '100vh'}}>
            <AuthBanner/>
        </div>

        <div style={{flex: 6}}>
            <AuthCredentials/>
        </div>
    </div>
}