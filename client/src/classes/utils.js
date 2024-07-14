class Utils{
    
    scrollToTop(elementRef) {
        if (elementRef.current)
            elementRef.current.scrollTo('', 0);
        else return;
    }

    set25PerPage(callback, elementRef) {
        callback(25);
        this.scrollToTop(elementRef);
    }
    set50PerPage(callback, elementRef) {
        callback(50);
        this.scrollToTop(elementRef);
    }
    set100PerPage(callback, elementRef) {
        callback(100);
        this.scrollToTop(elementRef);
    }
}

export default Utils;