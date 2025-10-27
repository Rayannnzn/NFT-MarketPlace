import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import NFTBox from "./NFTBox"
import Link from "next/link"

    interface NFTItem{
        data : {
          rindexerId: string,
          contractAddress: string,
          nftAddress: string,
          price: string,
          seller: string,
          tokenId: string,
          txHash: string,
          blockNumber: string
        }
    }

    interface ItemcancelledBought {
        data: {
            nftAddress: string,
             tokenId: string
        }
    }


    interface NFTQueryResponse{
        data : {

    allItemListeds : {
                nodes: NFTItem[]
            },

    allItemCanceleds : {
        nodes : ItemcancelledBought[]
            },

    allItemBoughts : {
        nodes : ItemcancelledBought[]
            } 
        }
}


const GET_RECENT_NFTS=`query Query {
  allItemListeds(first: 20, orderBy: [BLOCK_NUMBER_DESC,TX_INDEX_DESC]) {
    nodes {
      rindexerId
      contractAddress
      nftAddress
      price
      seller
      tokenId
      txHash
      blockNumber
    }
  }
  allItemCanceleds {
    nodes {
      nftAddress
      tokenId
    }
  }
  allItemBoughts {
    nodes {
      nftAddress
      tokenId
    }
  }
}`


    async function fetchNFTS(): Promise<NFTQueryResponse> {

        const response = await fetch('http://localhost:3001/graphql', {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
       },
            body : JSON.stringify({
                query : GET_RECENT_NFTS,
            }), 

            })

            return response.json()


    }

    console.log(await fetchNFTS());




// Main component that uses the custom hook
export default function RecentlyListedNFTs() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-8 text-center">
                <Link
                    href="/list-nft"
                    className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    List Your NFT
                </Link>
            </div>
            <h2 className="text-2xl font-bold mb-6">Recently Listed NFTs</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <img
                    src="/placeholder.png"
                    alt={`NFT`}
                    className="w-full h-auto max-h-96 object-contain bg-zinc-50"
                    onError={() => {
                        console.error("Error loading NFT image")
                    }}
                />
            </div>
        </div>
    )
}