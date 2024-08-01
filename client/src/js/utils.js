class Utils {

    increaseScale(setGameCardScale, gameCardScale) {
        if (gameCardScale >= 3) return;
        setGameCardScale(gameCardScale + 1);
    }
    decreaseScale(setGameCardScale, gameCardScale) {
        if (gameCardScale <= 0) return;
        setGameCardScale(gameCardScale - 1);
    }
    scrollToTop(ref) {
        if (ref.current) {
            ref.current.scrollTo('', 0);
        } else return;
    }
    goToFirstPage(setPage, scrollRef) {
        setPage(1);
        this.scrollToTop(scrollRef);
    }
    goToLastPage(setPage, totalPages, scrollRef) {
        setPage(totalPages);
        this.scrollToTop(scrollRef);

    }
    nextPage(page, totalPages, setPage, scrollRef) {
        if (page >= totalPages) return;
        setPage(page + 1);
        this.scrollToTop(scrollRef);
    }
    previousPage(page, setPage, scrollRef) {
        if (page <= 1) return;
        setPage(page - 1);
        this.scrollToTop(scrollRef);
    }
    sortAlphabetically(order, arr) {
        const sortedArr = arr.sort((a, b) => {
            if (order === 'asc')
                return a.name.toLowerCase().localeCompare(b.name);
            else if (order === 'desc')
                return b.name.toLowerCase().localeCompare(a.name);

            else return 0;
        })

        return sortedArr;
    }
}




export default Utils;