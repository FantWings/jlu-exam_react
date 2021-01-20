export default function Notices(props) {
  return (
    <span id="notices" className="bar error">
      <p>本工具仅供交流学习用途，请适度使用！任何因本工具导致的问题将不会为你付任何责任！</p>
      <small id="info">
        试卷号（UUID）：{props.paper_id} 丨 IP地址：{props.ip_addr}
      </small>
    </span>
  )
}
