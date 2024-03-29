import React, {FC, useEffect, useState, useContext} from 'react';
import {Alert, AlertTitle, Container, Stack} from "@mui/material";

import FilterTopbar from "../../components/FilterTopbar";
import FilterSidebar from "../../components/FilterSidebar";
import ListCards from "../../components/ListCard/ListCards";
import ShopSkeleton from "./component/ShopSkeleton";
import SortingCard from "../../components/SortingCard";
import useFetch from "../../hooks/useFetch";
import {isErrorNotElement} from "../../utils/index";
import ContextSearchUrl from "../../contexts/SearchUrl";

import s from "../../index.module.scss";

import {ICard} from "./../../types";

const MainShop:FC = () => {
    const [listCards, setListCards] = useState<ICard[]>([]);
    const [cloneListCards, setCloneListCards] = useState<ICard[]>([]);
    const [url, _] = useContext(ContextSearchUrl);
    const [{response, error, isLoading}, doFetch] = useFetch<{products: ICard[]}>(url);

    useEffect(() => {
        doFetch();
    }, [url]);

    useEffect(() => {
        if (!response) {
            return
        }

        setListCards(response.products);
        setCloneListCards(response.products);
    }, [response])

    if (error) {
        return (
            <>
                {
                    isErrorNotElement(error.message) ? (
                        <Alert severity="info">
                            <AlertTitle>0 card!</AlertTitle>
                            {error.message}
                        </Alert>
                    ) : (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            API temporarily not working. Try to reload the page
                        </Alert>
                    )
                }
            </>
        )
    }

    return (
            <div className={s.sector}>
                <FilterSidebar setListCards={setListCards} cloneListCards={cloneListCards}/>
                {isLoading && <ShopSkeleton count={6}/>}
                {!isLoading && response && (
                    <div>
                        {
                            (listCards) ? (
                                <>
                                    <SortingCard useListCard={[listCards, setListCards]}/>
                                    <ListCards list={listCards}/>
                                </>
                            ) : (
                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <Alert severity="info">Product not found!</Alert>
                                </Stack>
                            )
                        }
                    </div>
                )}
            </div>
    );
};

//Обёртка для устранения дублирования кода
const Shop:React.FC = () => {
    const [url, setUrl] = useState<string>('');
    return (
        <ContextSearchUrl.Provider value={[url, setUrl]}>
            <Container>
                <FilterTopbar/>
                <MainShop/>
            </Container>
        </ContextSearchUrl.Provider>
    )
}

export default Shop;