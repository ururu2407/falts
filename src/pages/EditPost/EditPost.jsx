import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditPost.scss';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
    LogoIcon,
    CloseIcon,
    GalleryIcon,
    UnsplashIcon,
    BackIcon,
    SearchIcon,
    TagIcon,
    RemoveIcon,
    GalleryExportIcon,
    ArrowNextIcon,
    ArrowBackIcon,
    BoldIcon,
    ItalicIcon,
    H1Icon,
    H2Icon,
    H3Icon,
    CodeBlockIcon,
    BulletListIcon,
    NumberedListIcon

} from '../../icons';
import {
    BubbleMenu,
    EditorContent,
    FloatingMenu,
    useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Placeholder from '@tiptap/extension-placeholder'
import { Drawer } from '@mui/material';
export const EditPost = () => {
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [unsplashActive, setUnsplashActive] = useState(false);
    const [blockIndex, setBlockIndex] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const imagesToShow = searchResults.slice(blockIndex * 9, blockIndex * 9 + 9);
    const showMoreButton = blockIndex * 3 + 3 < searchResults.length;
    const [redirect, setRedirect] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const params = useParams();
    const [data, setData] = useState([]);
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        const fetchPostAndTags = async () => {
            try {
                const postResponse = await axios.get(`https://04cb5470549a62ec.mokky.dev/posts/${params.id}`);
                const postData = postResponse.data;
                setData(postData);
                setImageUrl(postData.image);
                const tagsResponse = await axios.get(`https://04cb5470549a62ec.mokky.dev/tags`);
                const tagsData = tagsResponse.data;
                const updatedTags = tagsData.map((tag) => ({
                    ...tag,
                    display: 'none',
                    selected: postData.tags ? postData.tags.some(postTag => postTag.id === tag.id) : false,
                }));
                setTags(updatedTags);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchPostAndTags();
    }, [params.id]);

    const editorTitle = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Заголовок',
            })

        ],
        content: `<h1></h1>`,
    });
    useEffect(() => {
        if (editorTitle && data.title) {
            editorTitle.commands.setContent(`<h1>${data.title}</h1>`);
        }
    }, [editorTitle, data.title]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Document,
            Paragraph,
            Text,
            Image,
            Dropcursor,
            Placeholder.configure({
                placeholder: 'Почніть писати тут...',
            })

        ],
        content: `
        <p></p>
    `,
    });

    useEffect(() => {
        if (editor && data.text) {
            editor.commands.setContent(`${data.text}`);
        }
    }, [editor, data.text]);

    useEffect(() => {
        const filteredTags = tags.map((tag) => ({
            ...tag,
            display: tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 'flex' : 'none',
        }));
        setTags(filteredTags);
    }, [searchTerm]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const handleTagSelection = (tagId) => {
        setTags((prevTags) =>
            prevTags.map((tag) =>
                tag.id === tagId ? { ...tag, selected: !tag.selected } : tag
            )
        );
    };

    const removeTag = (tagId) => {
        setTags((prevTags) =>
            prevTags.map((tag) =>
                tag.id === tagId ? { ...tag, selected: false } : tag
            )
        );
    };

    const toggleActive = () => {
        setIsActive(true);
    };
    const toggleUnsplashActive = () => {
        setUnsplashActive(true);
    }
    const handleClickOutside = (event) => {
        if (!event.target.closest('.icon-menu')) {
            setIsActive(false);
        }
    };

    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }
    const handleSpanClick = () => {
        const url = window.prompt('Введіть URL зображення:');

        if (url !== null) {
            if (url.trim() !== '') {
                setImageUrl(url);
                console.log(imageUrl)
            } else {
                setImageUrl(null);
                console.log(imageUrl)
            }
        }
    };
    const searchUnsplashImages = async () => {
        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=d75A_CGFOPD6kE5oc7dX-UEODZ6hzAUb-O6Z0USyGXw`);
            setSearchResults(response.data.results);
        } catch (error) {
            console.error('Error searching images:', error);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        searchUnsplashImages();
    };
    const addImageToEditor = (url) => {
        editor.chain().focus().setImage({ src: url }).run();
        setUnsplashActive(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleShowMore = () => {
        setBlockIndex((prevIndex) => prevIndex + 1);
    };
    const handleShowPrev = () => {
        setBlockIndex((prevIndex) => prevIndex - 1);
    };

    const updatePost = () => {
        const selectedTags = tags.filter((tag) => tag.selected).map((tag) => ({
            id: tag.id,
            name: tag.name,
        }));
        const postImage = imageUrl ? imageUrl : 'https://i.imgur.com/L29x4vq.png';
        axios.patch(`https://04cb5470549a62ec.mokky.dev/posts/${params.id}`, {
            title: editorTitle.getText(),
            text: editor.getHTML(),
            image: postImage,
            tags: selectedTags,
        }).then(response => {
            console.log('Post created successfully:', response.data);
            setRedirect(true);

        }).catch(error => {
            console.error('Error creating post:', error);
        });
    }

    if (redirect) {
        return <Navigate to="/falts/" />;
    }

    const handleAddTag = async () => {
        if (searchTerm.trim() !== '') {
            const capitalizedTagName = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
            try {
                const response = await axios.post('https://04cb5470549a62ec.mokky.dev/tags', {
                    name: capitalizedTagName
                });

                if (response.status === 201) {
                    setTags(prevTags => [
                        ...prevTags,
                        {
                            id: response.data.id,
                            name: response.data.name,
                            display: 'flex',
                            selected: false
                        }
                    ]);
                    setSearchTerm('');
                } else {
                    console.error('Failed to add tag:', response);
                }
            } catch (error) {
                console.error('Error adding tag:', error);
            }
        }
    };
    const DrawerList = (
        <div className='drawer-list'>
            <div className='drawer-title'>
                <div className='drawer-title-icon'>
                    <BackIcon />
                </div>
                <p>Налаштування публікації</p>
            </div>
            <div className='drawer-tags'>
                <p>Додайте теми</p>
                <div className='search'>
                    <SearchIcon />
                    <input type="text"
                        placeholder='Пошук...'
                        value={searchTerm}
                        onChange={handleChange} />
                </div>
                {searchTerm === '' ? (
                    <div className='results'>
                        Ви можете додати існуючу тему або сторити нову.
                    </div>
                ) : (
                    <>
                        <div className='add-tag' onClick={handleAddTag}>
                            <TagIcon />
                            <p>Додати тему “{searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)}”</p>
                        </div>
                        <div className='divider' />
                        <div className='results'>
                            <div className='tags'>
                                <div className='menu'>
                                    {tags.map((tag) => (
                                        <div key={tag.id} className='tag' style={{ display: tag.display }}>
                                            <input
                                                type="checkbox"
                                                id={tag.id}
                                                checked={tag.selected}
                                                onChange={() => handleTagSelection(tag.id)}
                                            />
                                            <label htmlFor={tag.id}>{tag.name}</label>
                                        </div>
                                    ))}
                                    <div className='fade-top'></div>
                                    <div className='fade-bot'></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className='selected-tags'>
                    {tags.filter((tag) => tag.selected).map((tag) => (
                        <div key={tag.id} className='tag'>
                            <p>{tag.name}</p>
                            <div className='remove-tag' onClick={() => removeTag(tag.id)}>
                                <RemoveIcon />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='drawer-image'>
                <p className='title'>Додайте зображення</p>
                <p className='description'>Додайте зображення попереднього перегляду, щоб зробити пост більш привабливим для читачів.</p>
                {imageUrl ? (
                    <>
                        <div className='image'>
                            <img src={imageUrl} alt="" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='add-image'>
                            <GalleryExportIcon />
                            <p>Перетягніть або <span onClick={handleSpanClick}>натисніть</span> щоб додати зображення</p>
                        </div>
                    </>
                )
                }
            </div >
            <div className='drawer-button'>
                {tags.filter((tag) => tag.selected).length > 0 ?
                    <button className='btn' onClick={updatePost} >Опублікувати</button>
                    :
                    <button className='btn' disabled>Опублікувати</button>
                }
            </div>
        </div >
    )
    return (
        <>
            <header>
                <nav className='nav-left'>
                    <Link to={'/falts/'} style={{ textDecoration: 'none', height: '24px' }}>
                        <LogoIcon />
                    </Link>
                </nav>
                <p>{data.title}</p>
                <nav className='nav-right'>
                    <button className='create-btn' onClick={toggleDrawer(true)}>Опублікувати</button>
                    <Drawer anchor={'right'} open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                    </Drawer>
                </nav>

            </header>
            <div className='create-post'>
                <div className='content'>
                    {editor && (
                        <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={editor.isActive('bold') ? 'is-active' : ''}
                            >
                                <BoldIcon />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={editor.isActive('italic') ? 'is-active' : ''}
                            >
                                <ItalicIcon />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                            >
                                <H1Icon />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                            >
                                <H2Icon />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                            >
                                <H3Icon />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                className={editor.isActive('codeBlock') ? 'is-active' : ''}
                            >
                                <CodeBlockIcon />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={editor.isActive('bulletList') ? 'is-active' : ''}
                            >
                                <BulletListIcon />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={editor.isActive('orderedList') ? 'is-active' : ''}
                            >
                                <NumberedListIcon />
                            </button>
                        </BubbleMenu>
                    )}

                    {editor && (
                        <FloatingMenu className="floating-menu" tippyOptions={{ duration: 100 }} editor={editor}>
                            <div className={`icon-menu ${isActive ? 'active' : ''}`} onClick={toggleActive}>
                                <div className='icon plus' >
                                    <CloseIcon />
                                </div>
                                <div className='icon image' onClick={addImage}>
                                    <GalleryIcon />
                                </div>
                                <div className='icon image' onClick={toggleUnsplashActive}>
                                    <UnsplashIcon />
                                </div>
                            </div>
                        </FloatingMenu>

                    )}

                    <div className='editors'>
                        <EditorContent editor={editorTitle} />
                        <EditorContent editor={editor} />
                        {unsplashActive && (
                            <div className="search-container">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className='search'>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchInputChange}
                                            placeholder="Пошук зображень на Unsplash"
                                        />
                                    </div>
                                    <button type="submit">Шукати</button>
                                </form>
                                {showMoreButton && (
                                    <div className='show-more'>
                                        <button onClick={handleShowPrev}><ArrowBackIcon /></button>
                                        <button onClick={handleShowMore}><ArrowNextIcon /></button>
                                    </div>
                                )}
                                <div className="search-results">
                                    {imagesToShow.map((image) => (
                                        <div key={image.id} className="image-result" onClick={() => addImageToEditor(image.urls.full)}>
                                            <img src={image.urls.small} alt={image.alt_description} />
                                        </div>
                                    ))}

                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
