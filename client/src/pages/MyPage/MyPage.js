import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { Styled } from "./style";

import { userInfo, loginState, loginModal, token } from "../../recoil/recoil";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

import axios from "axios";

import { useRecoilValue } from "recoil";
import { token } from "../../recoil/recoil";

import { Profile, MyLike, MyReview, MyVisited } from ".";
import LikeLoading from "../../components/Loading/LikeLoading";

const MyPage = ({ match }) => {

  const [imgUrl, setImgUrl] = useState("/men.png");
  const [prevImg, setPrevImg] = useState("/men.png");
  const [nickname, setNickname] = useState("");
  const accessToken = useRecoilValue(token);
  const [info, setInfo] = useRecoilState(userInfo);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const setIsLoginOpen = useSetRecoilState(loginModal);
  const [loading, setLoading] = useState(false);
  
  const activeStyle = {
    color: "#172a71",
  };

  useEffect(() => {
    //! 우선 적음 나중에 지우게되도
    axios
      .get("https://localhost:80/user/info", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(true);
        setNickname(res.data.data.userInfo.nickname);
        if (res.data.data.userInfo.user_image_path) {
          setImgUrl(res.data.data.userInfo.user_image_path);
          setPrevImg(res.data.data.userInfo.user_image_path);
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Styled.Body>
        <nav className="menu-bar">
          <div className="profile">
            <div className="profile-image">{loading ? <LikeLoading /> : <img src={prevImg} />}</div>
            {/* <div className="profile-image">
              <img src={prevImg} />
            </div> */}
            <div className="profile-name">{nickname}</div>
          </div>
          <ul className="link-container">
            <li className="link-wrapper">
              <Styled.NavLink to={`${match.url}/like`} activeStyle={activeStyle}>
                좋아요 한 관광지
              </Styled.NavLink>
            </li>
            <li className="link-wrapper">
              <Styled.NavLink to={`${match.path}/visited`} activeStyle={activeStyle}>
                내가 가본 곳
              </Styled.NavLink>
            </li>
            <li className="link-wrapper">
              <Styled.NavLink to={`${match.url}/comments`} activeStyle={activeStyle}>
                내가 쓴 리뷰
              </Styled.NavLink>
            </li>
            <li className="link-wrapper">
              <Styled.NavLink to={`${match.url}`} activeStyle={activeStyle}>
                프로필 수정
              </Styled.NavLink>
            </li>
          </ul>
        </nav>

        <div className="page-container">
          <Route exact path={match.url} component={MyLike} />
          <Route exact path={`${match.url}/like`} component={MyLike} />
          <Route exact path={`${match.url}/visited`} component={MyVisited} />
          <Route exact path={`${match.url}/comments`} component={MyReview} />
          <Route exact path={`${match.url}/profile`}>

            <Profile
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
              prevImg={prevImg}
              setPrevImg={setPrevImg}
              setNickname={setNickname}
            />
          </Route>
        </div>

        <div>{/* justify-content:space-between을 위한 빈 태그 */}</div>
      </Styled.Body>
    </>
  );
};

export default MyPage;
