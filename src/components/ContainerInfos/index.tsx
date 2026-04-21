import React from 'react'
import styled from 'styled-components'

const StyledContainerInfos = styled.div`
    background-color: #fff3cd;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
`;

export const ContainerInfos = () => {
    return (
        <StyledContainerInfos>
            <h4>Permissoes por role</h4>
            <ul>
                <li><strong>Cliente:</strong> pode criar e acompanhar os proprios chamados.</li>
                <li><strong>Tecnico:</strong> pode atuar nos chamados atribuidos a ele.</li>
                <li><strong>Admin:</strong> possui acesso completo ao sistema.</li>
            </ul>
        </StyledContainerInfos>
    )
}
