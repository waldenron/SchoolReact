import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import { fetchData } from '../utils/apiServices';
import { Header, ItemIcon, LoadingSpinner, NotAllowed, getHomePageUrl, getInstUtils } from './Common';

import '../css/Gallery.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PicImage = ({ img, handleOnClickImg }) => {
    return (
        <div className="col">
            <div className="card" onClick={() => handleOnClickImg(img)}>
                <img src={img.src} alt="" className="card-img-top" />
                {img.name && (
                    <div className="card-body">
                        <p className="card-text fw-bold">{img.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
const PicModal = ({ img, handleOnClickX }) => {
    return (
        <>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <button type="button" className="btn-close btn-lg" onClick={() => handleOnClickX(null)}></button>
                        <div className="modal-body">
                            <img src={img.src} alt="" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </>
    );
}


function PicAlbums({ albums, selectedAlbum, handleOnClickAlbum }) {
    return (
        <div className="d-flex text-center border-top border-dark border-4">
            {albums.map((album, index) => (
                <figure className={`mx-2 ${selectedAlbum && selectedAlbum.id === album.id ? 'selected-album' : ''}`}
                    onClick={() => handleOnClickAlbum(album)} key={index}>
                    <FontAwesomeIcon icon="fas fa-solid fa-images" className="album-color" />
                    <figcaption className="h5">{album.name}</figcaption>
                </figure>
            ))}
        </div>
    );
}
function PicGalleryForDir() {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [images, setImages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        (async () => {
            const { data: fetchedData, error } = await fetchData('/api/DirPics');
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setImages(fetchedData);
        })();

        setLoading(false);
    }, []);

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    return (
        <div className="container-fluid w-lg-90 pb-5">
            <Header header="אלבום תמונות" />
            <div className="row row-cols-1 row-cols-md-3 g-4 pt-3">
                {images.map((img, index) => (
                    <PicImage key={index} img={img} handleOnClickImg={setSelectedImg} />
                ))}
            </div>

            {selectedImg && <PicModal img={selectedImg} handleOnClickX={setSelectedImg} />}
        </div>
    );
}
export default function PicGallery() {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const [images, setImages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        (async () => {
            if (!selectedAlbum) {
                const { data: fetchedDataAlbum } = await fetchData('/api/PicAlbums');
                setAlbums(fetchedDataAlbum);
                const defaultAlbum = fetchedDataAlbum.find(album => album.isDefault);
                if (defaultAlbum) setSelectedAlbum(defaultAlbum);
            }
            if (selectedAlbum) {
                const additionalHeaders = selectedAlbum && [{ name: 'albumId', value: selectedAlbum.id }];
                const { data: fetchedData, error } = await fetchData('/api/PicGallery', null, null, additionalHeaders);
                if (error && error.message === "Resource not found") setNotAlowed(true);
                else setImages(fetchedData);
            }
        })();

        setLoading(false);
    }, [selectedAlbum]);

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }

    const header = `אלבום תמונות - ${selectedAlbum && selectedAlbum.name}`;
    return (
        <div className="container-fluid w-lg-90 pb-5">
            <Header header={header} />
            <div className="row row-cols-1 row-cols-md-3 g-4 pt-3">
                {images && images.map((img, index) => (
                    <PicImage key={index} img={img} handleOnClickImg={setSelectedImg} />
                ))}
            </div>

            {selectedImg && <PicModal img={selectedImg} handleOnClickX={setSelectedImg} />}
            <PicAlbums albums={albums} selectedAlbum={selectedAlbum} handleOnClickAlbum={setSelectedAlbum} />
        </div>
    );
}