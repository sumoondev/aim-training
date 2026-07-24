import './Crosshair.css'

export default function Crosshair()
{
    return <>
        <div className="crosshair">
        <div className="crosshair-line top" />
        <div className="crosshair-line right" />
        <div className="crosshair-line bottom" />
        <div className="crosshair-line left" />
        </div>
    </>
}