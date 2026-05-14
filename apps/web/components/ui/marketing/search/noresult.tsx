export default function NoResult() {
    return (
        <div className="w-full h-full pt-30 flex flex-col gap-3 justify-center items-center">
            <video autoPlay loop muted
                   className="block w-75 h-75 backface-visibility-hidden border-none outline-none dark:hue-rotate-60">
                <source src={"/animations/Error.webm"}/>
            </video>
            <span className="font-atrament dark:text-white  text-2xl">{('no result').toUpperCase()}</span>
        </div>);
}