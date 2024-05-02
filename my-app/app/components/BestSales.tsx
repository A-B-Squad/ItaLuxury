import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { CiHeart } from "react-icons/ci";
import { BEST_SALES_QUERY } from "@/graphql/queries";

const BestSales = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<any>([]);
  const [getBestSales, { loading, error}] = useLazyQuery(BEST_SALES_QUERY);

  console.log(products);
  console.log(categories);

  useEffect(() => {
    const fetchBestSales = async () => {
      
      try {
        const { data } = await getBestSales()

        setProducts(data.getBestSales.map((product:any)=> (product.Product)))
        setCategories(products.map((product:any)=>(product.categories)))
        console.log(data);

   
        

        
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

    fetchBestSales()

  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <table className="text-sm  text-gray-500 ">
        <div className="text-xs mb-3 text-gray-700 uppercase bg-strongBeige">
          <tr>
            <th scope="col" className="px-6 py-3">
              OUTILLAGE ÉLECTROPORTATIF
            </th>
          </tr>
        </div>
        <div className="border max-h-96 overflow-y-scroll">
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
        </div>
      </table>
      <table className="text-sm  text-gray-500 ">
        <div className="text-xs mb-3 text-gray-700 uppercase bg-strongBeige">
          <tr>
            <th scope="col" className="px-6 py-3">
              OUTILLAGE ÉLECTROPORTATIF
            </th>
          </tr>
        </div>
        <div className="border max-h-96 overflow-y-scroll">
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
        </div>
      </table>
      <table className="text-sm  text-gray-500 ">
        <div className="text-xs mb-3 text-gray-700 uppercase bg-strongBeige">
          <tr>
            <th scope="col" className="px-6 py-3">
              OUTILLAGE ÉLECTROPORTATIF
            </th>
          </tr>
        </div>
        <div className="border max-h-96 overflow-y-scroll">
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 relative"
            >
              <div className="flex items-center">
                <img
                  className="max-w-24 max-h-24"
                  src="https://wamia-media.s3.eu-west-1.amazonaws.com/catalog/product/cache/77e000fbeece55e92f64fab77b1b3be8/p/p/pp319-4.jpg"
                  alt="product"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-left">
                    Torche 8 Modes + Allume Cigarette + Porte Clé + Clé
                    Bouteille
                  </p>
                  <div className="flex gap-2">
                    <span className="text-strongBeige">29,500 DT</span>
                    <span className="text-gray-400 line-through">
                      40,000 DT
                    </span>
                  </div>
                </div>
              </div>
              <CiHeart className="size-6 absolute top-2 right-2 cursor-pointer hover:text-strongBeige" />
            </th>
          </tr>
        </div>
      </table>
    </div>
  );
};

export default BestSales;
