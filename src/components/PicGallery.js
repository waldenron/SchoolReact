import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import { fetchData } from '../utils/apiServices';
import { Header, ItemIcon, LoadingSpinner, NotAllowed, getHomePageUrl, getInstUtils } from './Common';

import '../css/Gallery.css';

const PicImage = ({ img, handleOnClickImg }) => {
    return (
        <div className="col">
            <div className="card" onClick={() => handleOnClickImg(img)}>
                <img src={img.src} alt="" className="card-img-top" />
                {img.name && (
                    <div className="card-body">
                        <p className="card-text">{img.name}</p>
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


export function PicGalleryDir() {
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

    const [images, setImages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        (async () => {
            const { data: fetchedData, error } = await fetchData('/api/AlbumDirs');
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