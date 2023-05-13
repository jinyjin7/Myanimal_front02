// 글 상세보기

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    ArticleDetail(urlParams);
    loadComments(urlParams);
}

const article_id = new URLSearchParams(window.location.search).get('id');
async function ArticleDetail(article_id) {


    const response = await fetch(`${backend_base_url}/articles/${article_id}`, {
        method: 'GET',
    })

    response_json = await response.json()
    console.log(response_json)

    const category = document.querySelector('#category');
    const author = document.querySelector('#author');
    const article_title = document.querySelector('#article-title');
    const article_created_at = document.querySelector('#article-created-at');
    const article_updated_at = document.querySelector('#article-updated-at');
    const article_content = document.querySelector('#article-content');

    // const detail_product_img_url = `${BACKEND_API}/${response_json.image}`

    // detail_product_img.setAttribute('src', detail_product_img_url)
    category.innerText = response_json.category
    author.innerText = response_json.user
    article_title.innerText = response_json.article_title
    article_created_at.innerText = response_json.article_created_at
    article_updated_at.innerText = response_json.article_updated_at
    article_content.innerText = response_json.article_content

}

// 수정 페이지로 이동
function redirectUpdatePage() {
    window.location.href = `update_article.html?id=${article_id}`;
}


// 글 삭제

async function ArticleDelete() {

    const response = await fetch(`${backend_base_url}/articles/${article_id}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'DELETE',
    })
    if (response.status === 204) {
        alert("삭제 완료!")
        location.replace('index.html')
    } else {
        alert("권한이 없습니다.")
    }
}



// 댓글 작성

async function save_comment() {
    const comment = document.getElementById("comment").value

    const token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/articles/${article_id}/comment/`, {
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + token,
        },
        method: 'POST',
        body: JSON.stringify({
            "comment": comment,

        })
    })

    if (response.status == 201) {
        alert("댓글 작성 완료")
        location.reload();
    } else if (comment == '') {
        alert("댓글을 입력해 주세요.")
    }

}

// 댓글 불러오기(미완)

async function loadComments(article_id) {
    const response = await fetch(`${backend_base_url}/articles/${article_id}/comment/`);
    const comments = await response.json();
    console.log(comments)

    


    comments.forEach((comment) => {
        const commentList = document.getElementById('comment-list');
        commentList.insertAdjacentHTML ('beforeend',`
        
        <div class="card-header">
                <a>${comment.user}</a>
            </div>
            <div class="card-body" style="max-width: 1000px;">
                <div class="row g-5">
                    <!-- 유저 프로필 사진 -->
                    <div class="col-md-4" style="width: 200px;">
                        <img src="https://i.ibb.co/Ssm90Cq/4164335-1582361978747.gif" class="img-fluid rounded-start"
                            alt="..." style="width: 100px;">
                    </div>
                    <!-- 댓글 제목과 내용 입력-->
                    <div class="col-md-8">
                        <div class="card-body">
                            <p class="card-text">${comment.comment}</p>

                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <a href="#" class="btn btn-secondary btn-sm me-md-2">댓글 수정</a>
                            <a href="#" class="btn btn-secondary btn-sm">댓글삭제</a>
                        </div>
                        <p class="card-text"><small class="text-muted">${comment.comment_created_at}</small></p>
                    </div>
                </div>
            </div>
        
        
        `);
    });
}
