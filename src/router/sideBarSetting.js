//此js用来设置侧边栏以及对应显示的页面
import homeSvg from '../svgs/home.svg'
import searchSvg from '../svgs/search.svg';
import likeSvg from '../svgs/like.svg';
import listSvg from '../svgs/list.svg';
import editSvg from '../svgs/edit.svg';
import downloadSvg from '../svgs/download.svg';
let btns = [
    {
        id:1,
        svg:homeSvg,
        title:'显示主页',
        event:'showIndex'
    },
    {
        id:2,
        svg:searchSvg,
        title:'搜索页面',
        event:'showSearch'
    },
    {
        id:3,
        svg:likeSvg,
        title:'收藏的歌曲',
        event:'showLike'
    },
    {
        id:4,
        svg:listSvg,
        title:'创建的歌单',
        event:'showList'
    },
    {
        id:5,
        svg:downloadSvg,
        title:'我的下载',
        event:'showDownload'
    },
    {
        id:6,
        svg:editSvg,
        title:'设置',
        event:'showEdit'
    },
];

//是否在此文件中进行页面显示操作?

export default {
    btns
}