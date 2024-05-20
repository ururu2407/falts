import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePost.scss';
import { Link, Navigate } from 'react-router-dom';
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

export const CreatePost = () => {
    const [user, setUser] = useState(null);
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [enabled, setEnabled] = useState(false)
    const [imageUrl, setImageUrl] = useState(null);
    const [unsplashActive, setUnsplashActive] = useState(false);
    const [blockIndex, setBlockIndex] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const imagesToShow = searchResults.slice(blockIndex * 9, blockIndex * 9 + 9);
    const showMoreButton = blockIndex * 3 + 3 < searchResults.length;
    const [redirect, setRedirect] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        // Фільтруємо вибрані теги і створюємо новий масив об'єктів з вибраними тегами
        const selectedTags = tags.filter((tag) => tag.selected).map((tag) => ({
            id: tag.id,
            name: tag.name,
        }));
        // Встановлюємо зображення посту; якщо imageUrl не задано, використовуємо зображення за замовчуванням
        const postImage = imageUrl ? imageUrl : 'https://i.imgur.com/L29x4vq.png';
        // Виконуємо POST-запит для створення нового посту
        axios.post('https://04cb5470549a62ec.mokky.dev/posts', {
            title: editorTitle.getText(), // Отримуємо заголовок посту з редактора
            text: editor.getHTML(), // Отримуємо текст посту у форматі HTML з редактора
            date: new Date().toISOString(), // Встановлюємо поточну дату у форматі ISO
            user_id: user.id, // Використовуємо ID поточного користувача
            image: postImage, // Використовуємо встановлене зображення
            tags: selectedTags, // Додаємо вибрані теги
        }).then(response => {
            // Якщо пост успішно створено, виводимо відповідне повідомлення
            console.log('Post created successfully:', response.data);
            // Встановлюємо редирект для перенаправлення користувача
            setRedirect(true);
        }).catch(error => {
            // У випадку помилки виводимо повідомлення про помилку
            console.error('Error creating post:', error);
        });
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`https://04cb5470549a62ec.mokky.dev/tags`);
                const updatedTags = response.data.map((tag) => ({
                    ...tag,
                    display: 'none',
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
    // Ініціалізація редактора для заголовку поста
    const editorTitle = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Заголовок',
            })
        ],
        content: '<h1></h1>',
        onUpdate: ({ editor }) => {
            checkEditorsContent();
        }
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
        content: '<p></p>',
        onUpdate: ({ editor }) => {
            checkEditorsContent();
        }
    });


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
    const handleAddTag = async () => {
        // Перевіряємо, чи не є пошуковий запит пустим або складається лише з пробілів
        if (searchTerm.trim() !== '') {
            // Перша літера тега має бути великою, а решта - маленькими
            const capitalizedTagName = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);

            try {
                // Виконуємо POST-запит для додавання нового тега на сервер
                const response = await axios.post('https://04cb5470549a62ec.mokky.dev/tags', {
                    name: capitalizedTagName
                });

                // Перевіряємо, чи тег успішно створений (статус 201)
                if (response.status === 201) {
                    // Оновлюємо список тегів додаванням нового тега
                    setTags(prevTags => [
                        ...prevTags,
                        {
                            id: response.data.id,
                            name: response.data.name,
                            display: 'flex', // Додаємо властивість display
                            selected: false // Спочатку тег не вибраний
                        }
                    ]);
                    // Очищаємо пошуковий запит після додавання тега
                    setSearchTerm('');
                } else {
                    // Виводимо помилку в консоль, якщо додати тег не вдалося
                    console.error('Failed to add tag:', response);
                }
            } catch (error) {
                // Логування помилки у випадку виникнення помилки під час запиту
                console.error('Error adding tag:', error);
            }
        }
    };

    const checkEditorsContent = () => {
        const isTitleEmpty = editorTitle && editorTitle.getText().length === 0;
        const isContentEmpty = editor && editor.getText().length === 0;
        // console.log(!isTitleEmpty)
        setEnabled(!isTitleEmpty && !isContentEmpty);
    };

    useEffect(() => {
        checkEditorsContent();
    }, [editorTitle, editor]);

    const searchUnsplashImages = async () => {
        try {
            // Виконуємо GET-запит до API Unsplash для пошуку зображень за пошуковим запитом
            const response = await axios.get(`https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=d75A_CGFOPD6kE5oc7dX-UEODZ6hzAUb-O6Z0USyGXw`);
            // Оновлюємо стан результатами пошуку
            setSearchResults(response.data.results);
        } catch (error) {
            // Логування помилки у випадку виникнення помилки під час запиту
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
    if (redirect) {
        return <Navigate to="/falts/" />;
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
                    <button className='btn' onClick={createPost}>Опублікувати</button>
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
                <nav className='nav-right'>
                    {enabled ? (
                        <button className='create-btn' onClick={toggleDrawer(true)}>Опублікувати</button>
                    ) : (
                        <button className='create-btn' disabled onClick={toggleDrawer(true)}>Опублікувати</button>
                    )}
                    <Drawer anchor={'right'} open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                    </Drawer>
                </nav>

            </header>
            <div className='create-post'>
                <div className='content'>
                    {/* Перевіряємо, чи ініціалізовано редактор */}
                    {editor && (
                        // Відображаємо меню BubbleMenu, якщо редактор ініціалізовано
                        <BubbleMenu
                            className="bubble-menu"
                            tippyOptions={{ duration: 100 }} // Налаштування для Tippy.js
                            editor={editor} // Прив'язуємо редактор до меню
                        >
                            {/* Кнопка для переключення жирного тексту */}
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()} // Виконує команду для переключення жирного тексту
                                className={editor.isActive('bold') ? 'is-active' : ''} // Встановлює клас 'is-active', якщо жирний текст активний
                            >
                                <BoldIcon /> {/* Іконка для жирного тексту */}
                            </button>

                            {/* Кнопка для переключення курсивного тексту */}
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()} // Виконує команду для переключення курсивного тексту
                                className={editor.isActive('italic') ? 'is-active' : ''} // Встановлює клас 'is-active', якщо курсивний текст активний
                            >
                                <ItalicIcon /> {/* Іконка для курсивного тексту */}
                            </button>

                            {/* Кнопка для переключення заголовку рівня 1 */}
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} // Виконує команду для переключення заголовку рівня 1
                                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} // Встановлює клас 'is-active', якщо заголовок рівня 1 активний
                            >
                                <H1Icon /> {/* Іконка для заголовку рівня 1 */}
                            </button>

                            {/* Кнопка для переключення заголовку рівня 2 */}
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} // Виконує команду для переключення заголовку рівня 2
                                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} // Встановлює клас 'is-active', якщо заголовок рівня 2 активний
                            >
                                <H2Icon /> {/* Іконка для заголовку рівня 2 */}
                            </button>

                            {/* Кнопка для переключення заголовку рівня 3 */}
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} // Виконує команду для переключення заголовку рівня 3
                                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} // Встановлює клас 'is-active', якщо заголовок рівня 3 активний
                            >
                                <H3Icon /> {/* Іконка для заголовку рівня 3 */}
                            </button>

                            {/* Кнопка для переключення блоку коду */}
                            <button
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()} // Виконує команду для переключення блоку коду
                                className={editor.isActive('codeBlock') ? 'is-active' : ''} // Встановлює клас 'is-active', якщо блок коду активний
                            >
                                <CodeBlockIcon /> {/* Іконка для блоку коду */}
                            </button>

                            {/* Кнопка для переключення маркованого списку */}
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()} // Виконує команду для переключення маркованого списку
                                className={editor.isActive('bulletList') ? 'is-active' : ''} // Встановлює клас 'is-active', якщо маркований список активний
                            >
                                <BulletListIcon /> {/* Іконка для маркованого списку */}
                            </button>

                            {/* Кнопка для переключення нумерованого списку */}
                            <button
                                onClick={() => editor.chain().focus().toggleOrderedList().run()} // Виконує команду для переключення нумерованого списку
                                className={editor.isActive('orderedList') ? 'is-active' : ''} // Встановлює клас 'is-active', якщо нумерований список активний
                            >
                                <NumberedListIcon /> {/* Іконка для нумерованого списку */}
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
};
