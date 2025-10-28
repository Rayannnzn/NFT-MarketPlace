"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import NFTBox from "./NFTBox"
import Link from "next/link"

// ====================
// Correct Interfaces
// ====================

interface NFTItem {
  rindexerId: string
  contractAddress: string
  nftAddress: string
  price: string
  seller: string
  tokenId: string
  txHash: string
  blockNumber: string
}

interface ItemCancelledOrBought {
  nftAddress: string
  tokenId: string
}

interface NFTQueryResponse {
  data: {
    allItemListeds: {
      nodes: NFTItem[]
    }
    allItemCanceleds: {
      nodes: ItemCancelledOrBought[]
    }
    allItemBoughts: {
      nodes: ItemCancelledOrBought[]
    }
  }
}

// ====================
// GraphQL Query
// ====================

const GET_RECENT_NFTS = `
  query Query {
    allItemListeds(first: 20, orderBy: [BLOCK_NUMBER_DESC, TX_INDEX_DESC]) {
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
  }
`

// ====================
// Data Fetch Function
// ====================

async function fetchNFTS(): Promise<NFTQueryResponse> {
  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_RECENT_NFTS }),
  })


  return response.json()
}

// ====================
// Custom Hook
// ====================

function useRecentlyListedNfts() {
  const { data, isLoading, error } = useQuery<NFTQueryResponse>({
    queryKey: ["recentNfts"],
    queryFn: fetchNFTS,
  })

  const NftDataList = useMemo(() => {
    if (!data) return []
    

    const boughtNfts = new Set<string>()
    const cancelledNfts = new Set<string>()


    data.data.allItemBoughts.nodes.forEach((item) => {
      boughtNfts.add(`${item.nftAddress}-${item.tokenId}`)
    })

    data.data.allItemCanceleds.nodes.forEach((item) => {
      cancelledNfts.add(`${item.nftAddress}-${item.tokenId}`)
    })

    const availableNfts = data.data.allItemListeds.nodes.filter((item) => {
      if (!item.nftAddress || !item.tokenId) return false
      const key = `${item.nftAddress}-${item.tokenId}`
      return !boughtNfts.has(key) && !cancelledNfts.has(key)
    })

    return availableNfts.slice(0, 100).map((nft) => ({
      tokenId: nft.tokenId,
      contractAddress: nft.nftAddress,
      price: nft.price,
    }))


  }, [data])

  return { NftDataList, isLoading, error }
}

// ====================
// Main Component
// ====================

export default function RecentlyListedNFTs() {
  const { NftDataList, isLoading, error } = useRecentlyListedNfts()

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Loading NFTs...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">
          Error loading NFTs: {(error as Error).message}
        </p>
      </div>
    )

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

      {NftDataList.length === 0 ? (
        <p className="text-center text-gray-600">No NFTs currently listed.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {NftDataList.map((nft) => (
            <NFTBox
              key={`${nft.contractAddress}-${nft.tokenId}`}
              tokenId={nft.tokenId}
              contractAddress={nft.contractAddress}
              price={nft.price}
            />
          ))}
        </div>
      )}
    </div>
  )
}
