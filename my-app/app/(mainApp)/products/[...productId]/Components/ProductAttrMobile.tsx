import React, { memo } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface Attribute {
    name: string;
    value: string;
}

interface ProductAttrProps {
    attributes: Attribute[];
}

const ProductAttrMobile: React.FC<ProductAttrProps> = memo(({ attributes }) => {
    if (!attributes?.length) return null;
    
    return (
        <div className="my-6 block lg:hidden w-full">
            <Accordion 
                type="single" 
                collapsible 
                defaultValue="product-info"
                className="transition-all duration-300 ease-in-out"
            >
                <AccordionItem 
                    value="product-info"
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                    <AccordionTrigger 
                        className="text-base font-medium text-primaryColor w-full py-3 px-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <IoInformationCircleOutline className="text-xl" />
                            <span>Caractéristiques du produit</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white">
                        <div className="px-4 py-3 space-y-3">
                            {attributes.map((attribute, index) => (
                                <div 
                                    key={`attr-${attribute.name}-${index}`} 
                                    className="p-3 border border-gray-100 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                        {attribute.name}
                                    </span>
                                    <span className="block text-sm text-gray-800 break-words">
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
});


export default ProductAttrMobile;