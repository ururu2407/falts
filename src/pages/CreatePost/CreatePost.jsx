import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePost.scss';
import { Link } from 'react-router-dom';
import { LogoIcon, CloseIcon, GalleryIcon, UnsplashIcon } from '../../icons';
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
export const CreatePost = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);;

    const createPost = () => {
        axios.post('https://04cb5470549a62ec.mokky.dev/posts', {
            title: editorTitle.getText(),
            text: editor.getHTML(),
            date: new Date().toISOString(),
            user_id: user.id,
            tags: [

            ],
        }).then(response => {
            console.log('Post created successfully:', response.data);

        }).catch(error => {
            console.error('Error creating post:', error);
        });
    }
    // Используем useEditor для создания редактора
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
    const [isActive, setIsActive] = useState(false);

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
    return (
        <>
            <header>
                <nav className='nav-left'>
                    <Link to={'/falts/'} style={{ textDecoration: 'none', height: '24px' }}>
                        <LogoIcon />
                    </Link>
                </nav>
                <nav className='nav-right'>
                    <button onClick={createPost}>Create</button>
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
