import React from 'react'

interface Attribute {
    name: string;
    value: string;
}

interface ProductAttrProps {
    attributes: Attribute[];
}

const ProductAttr: React.FC<ProductAttrProps> = ({ attributes }) => {
    return (
        attributes && (
            <div className="my-10 mx-5 lg:mx-auto w-11/12 bg-white shadow-md">
                <h3 className="text-lg font-bold text-white w-fit p-3 bg-primaryColor">
                    Information de produit
                </h3>
                <ul className="mt-6 space-y-6 text-[#333] p-6">
                    {attributes.map((attribute, index) => (
                        <li key={index} className="text-sm pb-2 border-b">
                            {attribute.name.toUpperCase()}{" "}
                            <span className="ml-4 float-right">
                                {attribute.value.toUpperCase()}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
};

export default ProductAttr;
