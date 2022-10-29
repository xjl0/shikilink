import React from 'react';
import './App.css';
import {DOMMessage, DOMMessageResponse} from './types';
import imgLoading from './images/loading.webp';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBRipple,
    MDBRow
} from 'mdb-react-ui-kit';

function App() {
    const [title, setTitle] = React.useState<string>('');
    const [metaContent, setMetaContent] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [poster, setPoster] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);

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
                    setLoading(true);
                });
        });
    });

    const onClickLocation = (url: string | URL | undefined) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    const placeHoldersLoading = (): JSX.Element => {
        return (
            <>
                <MDBCard aria-hidden='true' style={{maxWidth: '48rem'}}>
                    <MDBRow className='g-0'>
                        <MDBCol md='4'>
                            <MDBCardImage src={imgLoading} alt='...' fluid/>
                        </MDBCol>
                        <MDBCol md='8'>
                            <MDBCardBody>
                                <MDBCardTitle className='placeholder-glow' style={{width: '33rem'}}>
                                    <span className='placeholder col-6'></span>
                                </MDBCardTitle>
                                <MDBCardText className='placeholder-glow'>
                                    <span className='placeholder col-12'></span>
                                    <span className='placeholder col-3'></span>
                                    <span className='placeholder col-4'></span>
                                    <span className='placeholder col-6'></span>
                                    <span className='placeholder col-8'></span>
                                    <span className='placeholder col-3'></span>
                                </MDBCardText>
                                <MDBBtn href='#' tabIndex={-1} className='placeholder col-3'></MDBBtn>
                            </MDBCardBody>
                        </MDBCol>
                    </MDBRow>
                </MDBCard>
            </>
        )
    }
    return (
        loading ?
            <>
                <MDBCard style={{maxWidth: '48rem'}}>
                    <MDBRow className='g-0'>
                        <MDBCol md='4'>
                            <MDBRipple rippleColor='light' rippleDuration={3000} rippleTag='span'><MDBCardImage
                                src={poster} alt='...'
                                fluid/></MDBRipple>
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
            </>
            :
            placeHoldersLoading()
    );
}

export default App;