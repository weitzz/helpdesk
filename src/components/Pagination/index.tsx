import { StyledPagination } from './style'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };
    return (
        <StyledPagination>
            <span>
                Pagina {currentPage} de {totalPages}
            </span>
            <div className="pages">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={handlePrevious}
                    aria-label="Página anterior"
                >
                    Anterior
                </button>
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                    aria-label="Próxima página"
                >
                    Próxima
                </button>
            </div>
        </StyledPagination>
    )
}

export default Pagination