Tạo file .env  thêm vào PORT = 8080
Nhập npm i vào terminal của dự án để tải các thư viện 
Start : npm run start 
Dev : npm run dev

1.Login:
POST : http://localhost:8080/users/login 
body :
email
password 

trả về kết quả:
{
	token , refreshToken,userID
}

Khi đăng nhập thành công sẽ trả về token , refreshToken,userID. Nhập Token vào Header với name là authorization, nhập UserID vào x-client-id cho các API, logout, handlerToken, update, create, delete. Trừ api: allArticle, findArticle By slug.

Nhập vào header với token trả về : 

authorization : TOKEN HERE 

x-client-id : USER ID HERE
 
2.Register:
POST : http://localhost:8080/users/register
name
email
password 
password1

3.Handler Refresh token:
POST :http://localhost:8080/users/handlerRefreshToken
header:
x-rtoken-id: Nhập vào RefreshToken
x-client-id:
Trả về Token và RefreshToken mới để nhập vào các APi khác.

4.GetAllArticle: 
GET : http://localhost:8080/article/

5.Find Article by slug : 
GET : http://localhost:8080/article/:id
Nhập slug cần tìm vào article ví dụ http://localhost:8080/article/bai-bao-1

6.Update Article :
PUT : http://localhost:8080/article/:id
Các thông số trong body Request : 
title , content ,draft,expert,published , filename chứa image 

7.Delete Article : 
Delete : http://localhost:8080/article/:id 
Nhập id cần tìm để xoá bài viết 

8.Create Article: 
POST : http://localhost:8080/article/create-article
Nhập các thông số vào body : 
{
	title, content, excerpt, image, draft, published
}
kiểu dữ liệu :  

titile : string , 
content : array,
excerpt : string,
image : string, 
draft : Boolean , 
published : Boolean

9.Logout : 
POST : http://localhost:8080/users/logout













