export default function Die(props) {
    const styles = {
        // changed blue to something red-ish
        backgroundColor: props.isClicked ? "#bc5448" : "gray"
    }

    return (
        <button 
            style = {styles}
            onClick = {() => props.hold(props.id)}
        >{props.value}</button>
    )
}