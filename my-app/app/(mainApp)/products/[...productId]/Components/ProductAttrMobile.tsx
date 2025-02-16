import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { GiClick } from 'react-icons/gi';

interface Attribute {
    name: string;
    value: string;
}

interface ProductAttrProps {
    attributes: Attribute[];
}

const ProductAttrMobile: React.FC<ProductAttrProps> = ({ attributes }) => {
    return attributes?.length > 0 && (
        <div className="my-8 block lg:hidden w-full bg-white overflow-hidden border-b-2 border-gray-200">
            <Accordion type="single" collapsible className="transition-all duration-300 ease-in-out">
                <AccordionItem value="product-info">
                    <AccordionTrigger className="text-lg flex items-center gap-1 font-semibold text-black w-full py-4 px-1 transition-all duration-300 ease-in-out hover:bg-opacity-90">
                        Information de produit
                        <GiClick className="transition-transform duration-300 ease-in-out group-hover:rotate-12" />
                    </AccordionTrigger>
                    <AccordionContent className="transition-all duration-300 ease-in-out">
                        <div className="px-4 py-5 space-y-4">
                            {attributes.map((attribute, index) => (
                                <div 
                                    key={index} 
                                    className="p-4 border rounded-md shadow-sm bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                                >
                                    <span className="block text-xs font-semibold text-gray-600 tracking-wide">
                                        {attribute.name.toUpperCase()}
                                    </span>
                                    <span className="block mt-1 text-sm text-gray-900 font-medium break-words">
                                        {attribute.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ProductAttrMobile;