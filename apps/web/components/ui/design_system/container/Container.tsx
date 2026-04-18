interface ContainerType extends React.HTMLProps<HTMLDivElement> {
    width?: string;
    height?: string;

}

const Container = (props : ContainerType) => {
    const {children, width, height} = props;
    return (<div className={` ${width ? width : "w-full"} h-full rounded-3xl border border-studoborder/30 bg-studogrey/30 p-5 flex flex-col gap-3`}>
        {children}
    </div>)
}

Container.displayName = 'Container'
export default Container;