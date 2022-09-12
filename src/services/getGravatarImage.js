import md5 from 'crypto-js/md5';

const getGravatarImage = (userEmail) => `https://www.gravatar.com/avatar/${md5(userEmail).toString()}`;

export default getGravatarImage;
