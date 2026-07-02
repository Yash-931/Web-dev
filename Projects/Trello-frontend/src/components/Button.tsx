export function Button(props) {
    return <div style={{padding: "10px 40px", cursor: "pointer", borderRadius: "5px", border: "1px solid black"}} onClick={props.onClick}> {props.children} </div>
}