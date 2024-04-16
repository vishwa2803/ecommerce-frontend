export default  function ProductImages({images}) {
    return(
        <>
        <img src={images?.[0]} />
        </>
    )
}