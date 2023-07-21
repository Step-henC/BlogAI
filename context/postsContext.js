import React, {useCallback, useState} from 'react';


const PostContext = React.createContext({}); //create a context to handle posts from server side props

//then do client side fetch to retrieve more posts until there are no more posts available


export default PostContext;

export const PostProvider = ({children}) => {
    const [posts, setPosts] = useState([]); //local state to house and store all retrieved posts

    const setPostsFromSSR = useCallback((postsFromSSR = []) => { //default postsFromSSR to an empty array in case no posts are sent in this function

        setPosts(postsFromSSR);
        //limit post size in getAppProps
        //wrap in useCallback to memoize function and prevent unneccessary reloads of components consuming our post context
    }, []); //empty array as second argument cuz this function will not be responsible for causing reloads of any component

    return <PostContext.Provider value={{posts, setPostsFromSSR}}>{children}</PostContext.Provider>
}