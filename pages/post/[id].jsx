export default function Post({ test, comments }) {
    return <h1>{comments}</h1>;
}

export async function getServerSideProps(context) {
    const postId = context.query.id;
    return {
        props: {
            post: 'test',
            comments: 'test',
        },
    };
}
