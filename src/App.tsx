import React from 'react';
import './App.css';
import {ChromeMessage, DOMMessage, DOMMessageResponse, Sender} from './types';
import imgLoading from './images/loading.webp';
import {
    MDBBtn,
    MDBBtnGroup,
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
    const [titleContent, setTitleContent] = React.useState<string>("");
    const [metaContent, setMetaContent] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [poster, setPoster] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const msg: ChromeMessage = {
            from: Sender.React,
            message: {type: 'GET_DOM'} as DOMMessage,
        }
        chrome.tabs && chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id || 0, msg, (response: DOMMessageResponse) => {
                if (response) {
                    setTitleContent(response.title || "");
                    setMetaContent(response.metaContent || "");
                    setDescription(response.description || "");
                    setPoster(response.poster || imgLoading);
                    setLoading(true);
                }
            });
        });
    }, []);

    const onClickLocation = (url: string | URL | undefined) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    const placeHoldersLoading = (): JSX.Element => {
        return (
            <>
                <MDBCard aria-hidden='true' style={{maxWidth: '48rem'}}>
                    <MDBRow className='g-0'>
                        <MDBCol md='4'>
                            <MDBCardImage src={imgLoading} alt='loading' fluid/>
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
                                <MDBCardTitle style={{width: '33rem'}}>{titleContent}</MDBCardTitle>
                                <MDBCardText>
                                    {description.replace(/(<([^>]+)>)/gi, "").slice(0, 200)}...
                                </MDBCardText>
                                {metaContent && <MDBBtnGroup aria-label='Basic example'>
                                    <MDBBtn
                                        title={"Перейти на сайт Smotret Anime 'Anime365'"}
                                        onClick={() => onClickLocation("https://smotret-anime.com/catalog/search?q=" + encodeURI(metaContent))}>
                                        Anime365
                                    </MDBBtn>
                                    <MDBBtn
                                        title={"Перейти на сайт AnimeGO"}
                                        onClick={() => onClickLocation("https://animego.org/search/anime?q=" + encodeURI(metaContent))}>
                                        AnimeGO
                                    </MDBBtn>
                                </MDBBtnGroup>}
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