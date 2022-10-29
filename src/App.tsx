import React from 'react';
import './App.css';
import {DOMMessage, DOMMessageResponse} from './types';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBCol, MDBRow} from 'mdb-react-ui-kit';

function App() {
    const [title, setTitle] = React.useState<string>('');
    const [metaContent, setMetaContent] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [poster, setPoster] = React.useState<string>("");

    React.useEffect(() => {
        chrome.tabs && chrome.tabs.query({
            active: true,
            currentWindow: true
        }, tabs => {
            chrome.tabs.sendMessage(
                tabs[0].id || 0,
                {type: 'GET_DOM'} as DOMMessage,
                (response: DOMMessageResponse) => {
                    setTitle(response.title);
                    setMetaContent(response.metaContent);
                    setDescription(response.description);
                    setPoster(response.poster);
                });
        });
    });

    const onClickLocation = (url: string | URL | undefined) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <MDBCard className={"d-flex justify-content-center"} style={{maxWidth: '48rem'}}>
            <MDBRow className='g-0'>
                <MDBCol md='4'>
                    <MDBCardImage src={poster} alt='...' fluid/>
                </MDBCol>
                <MDBCol md='8'>
                    <MDBCardBody>
                        <MDBCardTitle>{title}</MDBCardTitle>
                        <MDBCardText>
                            {description.replace(/(<([^>]+)>)/gi, "").slice(0, 200)}...
                        </MDBCardText>
                        <MDBBtn
                            title={"Перейти на сайт Smotret Anime 'Anime365'"}
                            onClick={() => onClickLocation("https://smotret-anime.com/catalog/search?q=" + encodeURI(metaContent))}>
                            Смотреть
                        </MDBBtn>
                    </MDBCardBody>
                </MDBCol>
            </MDBRow>
        </MDBCard>
    );
}

export default App;