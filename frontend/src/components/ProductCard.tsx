interface ProductCard{
    productName:string
    productImageUrl: string

}
const ProductCard = ({productName, productImageUrl}: ProductCard)=>{
    return(
        <>
            <div className="max-w-sm rounded overflow-hidden shadow-lg shadow-surface-0 m-4 flex justify-center flex-col items-center bg-surface-1 hover:scale-101 hover:transition-transform transition-duration[300] cursor-pointer">
                <img className="w-full" src={productImageUrl} alt="Sunset in the mountains"></img>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 text-text">
                        {productName}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard;