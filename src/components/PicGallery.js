import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


import { fetchData } from '../utils/apiServices';
import { Header, LoadingSpinner, NotAllowed } from './Common';

import '../css/Gallery.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PicImage = ({ img, handleOnClickImg }) => {
    return (
        <div className="col" role="button">
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

const PicModal = ({ images, img, handleOnClickX }) => {
    const [currentImgIndex, setCurImgIndex] = useState(images.findIndex(image => image.src === img.src));

    const goToPrevImg = () => {
        setCurImgIndex(currentIndex => currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    };

    const goToNextImg = () => {
        setCurImgIndex(currentIndex => (currentIndex + 1) % images.length);
    };

    const selectedImg = images[currentImgIndex];

    return (
        <>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <button type="button" className="btn-close btn-lg" onClick={() => handleOnClickX(null)}></button>

                        <div className="modal-body w-sm-90 mx-auto">
                            <FontAwesomeIcon icon="fa-chevron-right" className="fs-2 text-start my-auto btn btn-light btn-lg-md" aria-label="Previous Image" onClick={goToPrevImg} />
                            <img src={selectedImg.src} alt={selectedImg.src} className="img-fluid" />
                            <FontAwesomeIcon icon="fa-chevron-left" className="fs-2 text-end my-auto btn btn-light btn-lg-md" aria-label="Next Image" onClick={goToNextImg} />
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
        <div className="d-flex text-center border-top border-dark border-4" role="button">
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
export function PicGalleryForDir() {
    const folderId = localStorage.getItem('folderId');

    let { name: folderName } = useParams();
    folderName = decodeURIComponent(folderName);

    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [images, setImages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        (async () => {
            const additionalHeaders = folderId && [{ name: 'folderId', value: folderId }];

            const { data: fetchedData, error } = await fetchData('/api/PicGalleryForDir', null, null, additionalHeaders);
            if (error && error.message === "Resource not found") setNotAlowed(true);
            else setImages(fetchedData);

            setLoading(false);
        })();
    }, []);

    if (loading) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }
    //const header = `אלבום תמונות - ${folderName && folderName}`;
    const header = `${folderName && folderName}`;
    return (
        <div className="container-fluid w-lg-90 pb-5">
            <Header header={header} />
            <div className="row row-cols-1 row-cols-md-3 g-4 py-3">
                {images && images.map((img, index) => (
                    <PicImage key={index} img={img} handleOnClickImg={setSelectedImg} />
                ))}
            </div>

            {images && selectedImg && <PicModal images={images} img={selectedImg} handleOnClickX={setSelectedImg} />}
        </div>
    );
}
export default function PicGallery() {
    const [loading, setLoading] = useState(true);
    const [notAlowed, setNotAlowed] = useState(false);

    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const [folderImages, setFolderImages] = useState([]);

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
                else setFolderImages(fetchedData);
            }

            setLoading(false);
        })();
    }, [selectedAlbum]);

    const handleOnClickImg = (folderImage) => {
        localStorage.setItem('folderId', folderImage.folderId);
        //const folderUrl = `/PicGallery/${encodeURIComponent(`${selectedAlbum.name} - ${folderImage.name}`)}`;
        const folderUrl = `/PicGallery/${encodeURIComponent(folderImage.name)}`;
        window.open(folderUrl, "_blank");
    };

    if (loading || !folderImages || folderImages.length === 0) { return <LoadingSpinner />; }
    if (notAlowed) { return <NotAllowed />; }

    const header = `${selectedAlbum && selectedAlbum.name}`;
    return (
        <div className="container-fluid w-lg-90 pb-5">
            <Header header={header} />
            <div className="row row-cols-1 row-cols-md-3 g-4 py-3">
                {folderImages && folderImages.map((folderImage, index) => (
                    <PicImage key={index} img={folderImage} handleOnClickImg={handleOnClickImg} />
                ))}
            </div>
            <PicAlbums albums={albums} selectedAlbum={selectedAlbum} handleOnClickAlbum={setSelectedAlbum} />
        </div>
    );
}