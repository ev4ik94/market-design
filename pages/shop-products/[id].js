import Head from 'next/head'
import {useState, useEffect} from 'react'
import MainLayout from '../../components/MainLayout';
import useHttp from '../../hooks/http.hook';
import Link from "next/link";
import {getCookie, decrypt, paginationCalc} from "../../components/secondary-functions";
import { useRouter } from 'next/router';

export default function Product({products:serverProduct}) {

    const router = useRouter()

    console.log(serverProduct)


    return (
        <MainLayout title={'Title'}>

            <h1>Product {router.query.id}</h1>



            <style jsx>
                {
                    `
                    
                        
                  
                  `
                }
            </style>
        </MainLayout>
    )
}




export async function getServerSideProps(ctx){

    const {id} = ctx.query;
    const response = await fetch(`${process.env.API_URL}/api/products/${id}`)
    const post = await response.json()


    return {
        props:{products:post}
    }
}