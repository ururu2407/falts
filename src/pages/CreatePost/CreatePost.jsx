import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePost.scss';
import { Link } from 'react-router-dom';
import { LogoIcon, CloseIcon, GalleryIcon, UnsplashIcon, BackIcon, SearchIcon, TagIcon, RemoveIcon } from '../../icons';
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
export const CreatePost = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(false);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);;

    const createPost = () => {
        // Получаем массив объектов выбранных тегов в нужном формате
        const selectedTags = tags.filter((tag) => tag.selected).map((tag) => ({
            id: tag.id,
            name: tag.name,
        }));
        axios.post('https://04cb5470549a62ec.mokky.dev/posts', {
            title: editorTitle.getText(),
            text: editor.getHTML(),
            date: new Date().toISOString(),
            user_id: user.id,
            tags: selectedTags,
        }).then(response => {
            console.log('Post created successfully:', response.data);
        }).catch(error => {
            console.error('Error creating post:', error);
        });
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`https://04cb5470549a62ec.mokky.dev/tags`);
                const updatedTags = response.data.map((tag) => ({
                    ...tag,
                    display: 'none', // Добавляем свойство display со значением 'none'
                    selected: false,
                }));
                setTags(updatedTags);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const filteredTags = tags.map((tag) => ({
            ...tag,
            display: tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 'flex' : 'none',
        }));
        setTags(filteredTags);
    }, [searchTerm]);

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
    const editorTitle = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Заголовок',
            })

        ],
        content: `
            <h1></h1>
        `,
    });
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
        // Передаем начальный контент в редактор
        content: `
          <p></p>
        `,
    });

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.icon-menu')) {
            setIsActive(false);
        }
    };

    // Добавляем обработчик события для проверки клика вне элемента icon-menu
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

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
                        <div className='add-tag'>
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
            <button onClick={createPost}>Створити публікацію</button>
        </div>
    )
    return (
        <>
            <header>
                <nav className='nav-left'>
                    <Link to={'/falts/'} style={{ textDecoration: 'none', height: '24px' }}>
                        <LogoIcon />
                    </Link>
                </nav>
                <nav className='nav-right'>
                    <button onClick={toggleDrawer(true)}>Create</button>
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
                                Bold
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={editor.isActive('italic') ? 'is-active' : ''}
                            >
                                Italic
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                className={editor.isActive('strike') ? 'is-active' : ''}
                            >
                                Strike
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
                                <div className='icon image'>
                                    <UnsplashIcon />
                                </div>
                            </div>
                            {/* <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                            >
                                H1
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                            >
                                H2
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={editor.isActive('bulletList') ? 'is-active' : ''}
                            >
                                Bullet List
                            </button> */}
                        </FloatingMenu>
                    )}

                    {/* Передаем редактору обработчик изменений контента */}
                    <div className='editors'>
                        <EditorContent editor={editorTitle} onChange={() => setTitle(editorTitle.getText())} />
                        <EditorContent editor={editor} />
                    </div>
                    {/* Кнопка для вывода значения title в консоль */}
                    <button onClick={() => {
                        if (editor) {
                            setTitle(editor.getText());
                            console.log(title);
                            console.log(editor.getHTML());
                        }
                    }}>Log Content</button>
                </div>
            </div>
        </>
    );
};
