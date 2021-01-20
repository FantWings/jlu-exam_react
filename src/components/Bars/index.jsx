export default function Bars(props) {
  return (
    <span className={'bar ' + props.status}>
      <h3 id="msg_tittle">{props.title}</h3>
      <small id="msg_text">{props.text}</small>
    </span>
  )
}
