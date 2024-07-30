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
}




export default Utils;