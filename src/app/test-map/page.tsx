import MiniMap from "@/components/map/minimap"

export default function TestMapPage(){
    return (
        <div className="w-[30vw] h-[30vw] justify-center flex">
            {/* <div className=""> */}
                <MiniMap name="Kuy" lat={13.7563} long={100.5018} />
            {/* </div> */}
        </div>
    )
}