<template>
    <div className="login-main-page" :style="{ backgroundImage: `url(${loginbg})` }">
        <div className="login-wrapper">
            <div className="login-aside-left">
                <router-link to="/dashboard" className="login-logo">
                    <img :src="logo" alt="" />
                </router-link>
                <div className="login-description">
                    <h2 className="main-title mb-2">Welcome To HexLink</h2>
                    <p className="">Hexlink transforms your email or any social account to wallet address. Now you can
                        simply share your email to receive tokens without downloading or signing up anything. It's as easy
                        as using Zelle!</p>
                    <ul className="social-icons mt-4" style="list-style-type:none; padding: 0;">
                        <li>
                            <router-link to="#"><i className="fa fa-facebook"></i></router-link>
                        </li>
                        <li>
                            <router-link to="#"><i className="fa fa-twitter"></i></router-link>
                        </li>
                        <li>
                            <router-link to="#"><i className="fa fa-linkedin"></i></router-link>
                        </li>
                    </ul>
                    <div className="mt-5 bottom-privacy">
                        <router-link to="#" className="mr-4">Privacy Policy</router-link>
                        <router-link to="#" className="mr-4">Contact</router-link>
                        <router-link to="#" className="">© 2022 Hexlink</router-link>
                    </div>
                </div>
            </div>
            <div className="login-aside-right">
                <div className="row m-0 justify-content-center h-100 align-items-center">
                    <div className="p-5">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form-1">
                                        <div className="mb-4">
                                            <h3 className="dz-title mb-1">Hexlink: start your web3 journey</h3>
                                            <p className="">Sign in with options below</p>
                                        </div>
                                        <!-- Sign in with Google -->
                                        <a-row justify="center" style="margin-top: 30px;">
                                            <button size="large" @click="google_login" className="google__btn">
                                                <i class="fa fa-google"></i>&nbsp;&nbsp;
                                                Sign in with Google
                                            </button>
                                        </a-row>
                                        <!-- Sign in with Twitter -->
                                        <a-row justify="center" style="margin-top: 5px;">
                                            <button size="large" @click="twitter_login" className="twitter__btn">
                                                <i class="fa fa-twitter"></i>&nbsp;&nbsp;
                                                Sign in with Twitter
                                            </button>
                                        </a-row>
                                        <!-- Sign in with facebook -->
                                        <a-row justify="center" style="margin-top: 5px;">
                                            <button size="large" @click="github_login" className="facebook__btn">
                                                <i class="fa fa-facebook"></i>&nbsp;&nbsp;
                                                Sign in with Facebook
                                            </button>
                                        </a-row>
                                        <!-- Sign in with Github -->
                                        <a-row justify="center" style="margin-top: 5px;">
                                            <button size="large" @click="github_login" className="github__btn">
                                                <i class="fa fa-github"></i>&nbsp;&nbsp;
                                                Sign in with GitHub
                                            </button>
                                        </a-row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'; 
    import { googleSocialLogin, twitterSocialLogin, githubSocialLogin, facebookSocialLogin } from '@/services/auth'
    import { useAuthStore } from '@/stores/auth'
    import logo from "../assets/hori-white-logo.svg"
    import loginbg from "../assets/bg-login.jpg"

    const store = useAuthStore();
    const router = useRouter();

    const google_login = async () => {
        await googleSocialLogin();
        router.push(store.returnUrl || "/");
    }

    const twitter_login = async () => {
        await twitterSocialLogin();
        router.push(store.returnUrl || "/");
    }

    const github_login = async () => {
        await githubSocialLogin();
        router.push(store.returnUrl || "/");
    }

    const facebook_login = async () => {
        await facebookSocialLogin();
        router.push(store.returnUrl || "/");
    }
</script>

<style lang="less" scoped>
.title {
        margin: 10px 0px 40px 0px;
        font-family: system-ui;
        font-size: 1.5em;
        font-weight: bold;
    }

    .login-main-page {
        padding: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
        height: 100vh;
        z-index: 1;
    }

    .login-main-page .login-wrapper {
        background: #fff;
        max-width: 65vw;
        margin-left: auto;
        margin-right: auto;
    }
    .login-main-page .main-title {
        color: #fff;
        font-size: 50px;
        line-height: 1.3;
        font-weight: 700;
    }
    .login-main-page:after {
        content: "";
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.2);
        z-index: -1;
    }
    // @media only screen and (max-width: 991px) {
    // .login-main-page {
    //     padding: 100px 0px 100px 0px;
    // .login-wrapper {
    //     max-width: 90vw; } } }
    @media only screen and (max-width: 991px) {
        // .login-main-page {
        //     padding: 0px; }
            .login-main-page .main-title {
                font-size: 30px; } }
    .login-wrapper {
        display: flex;
        min-height: 600px;
        height: calc(100vh - 400px);
        box-shadow: 0 0 60px 10px rgba(85, 44, 44, 0.2); }
        .login-wrapper .bottom-privacy {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            line-height: 1.5; }
            .login-wrapper .bottom-privacy a {
                color: inherit; }

        .login-wrapper .login-aside-left {
            max-width: 60%;
            flex: 0 0 60%;
            position: relative;
            display: table;
            padding: 50px;
            z-index: 1;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: bottom;
            background: linear-gradient(to right, #5bcfc5 25%, #3197b7 100%);
            overflow: hidden; }

            .login-wrapper .login-aside-left:before, .login-wrapper .login-aside-left:after {
                position: absolute;
                z-index: -1;
                content: "";
                box-shadow: 0 0 0 60px rgba(255, 255, 255, 0.1); }
            .login-wrapper .login-aside-left:before {
                background: #759dd9;
                width: 150px;
                height: 150px;
                border-radius: 35px;
                left: -35px;
                top: 30%;
                transform: rotate(45deg);
                animation: dzMove1 5s linear infinite; }
            .login-wrapper .login-aside-left:after {
                background: #ffa755;
                width: 150px;
                height: 150px;
                border-radius: 35px;
                right: -30px;
                top: -30px;
                transform: rotate(45deg);
                animation: dzMove1 8s linear infinite; }

            .login-wrapper .login-aside-left .login-description {
                display: table-cell;
                vertical-align: bottom; }
                .login-wrapper .login-aside-left .login-description p {
                    font-size: 0.85vw;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.5; }
                @media only screen and (max-width: 575px) {
                    .login-wrapper .login-aside-left .login-description p {
                        font-size: 0.7vw; } }
    .login-wrapper .dz-title {
        color: #000;
        font-weight: 700;
        font-size: 35px; }
    .login-wrapper p {
        font-size: 16px;
        color: #666; }
    .login-wrapper .login-aside-right {
        max-width: 40%;
        flex: 0 0 40%;
        display: flex;
        align-items: center;
        justify-content: center; }
    .login-wrapper .social-icons {
        display: flex; }
        .login-wrapper .social-icons li {
            margin-right: 10px; }
            .login-wrapper .social-icons li a {
                height: 45px;
                width: 45px;
                color: #fff;
                border-radius: 12px;
                line-height: 45px;
                font-size: 18px;
                display: inline-block;
                text-align: center;
                border: 0;
                background: rgba(255, 255, 255, 0.2);
                -webkit-transition: all 0.5s;
                -ms-transition: all 0.5s;
                transition: all 0.5s; }
                .login-wrapper .social-icons li a:hover {
                    background: #fff;
                    color: #000; }
    .login-wrapper .login-logo {
        position: absolute; }
    .login-wrapper .authincation-content {
        background-color: transparent;
        box-shadow: none; }
    .login-wrapper .form-group {
        margin-bottom: 15px; }
    .login-wrapper .form-group label {
        font-size: 14px;
        color: #666; }
    .login-wrapper .custom-checkbox .custom-control-input {
        margin-right: 10px;
        top: 2px;
        position: relative; }
    .login-wrapper .form-control {
        background: transparent;
        border: 0;
        border-bottom: 2px solid #000;
        border-radius: 0 !important;
        padding: 0;
        color: #000; }
    .login-wrapper .form-control::placeholder {
        color: #999;
        opacity: 0.7; }
    .login-wrapper .form-control:-ms-input-placeholder {
        color: #999;
        opacity: 0.7; }
    .login-wrapper .form-control::-ms-input-placeholder {
        color: #999;
        opacity: 0.7; }
    .login-wrapper .form-control,
    .login-wrapper .btn {
        border-radius: 8px; }
    @media only screen and (max-width: 1199px) {
        .login-wrapper .login-aside-left {
            width: 470px; } }
    // @media only screen and (max-width: 991px) {
    //     .login-wrapper {
    //         height: calc(100vh - 100px); } }
    @media only screen and (max-width: 991px) {
        .login-wrapper {
            display: block;
            height: auto; }
            .login-wrapper .login-aside-left,
            .login-wrapper .login-aside-right {
                max-width: 100%;
                flex: 0 0 100%; }
            .login-wrapper .login-logo {
                position: relative;
                margin-bottom: 20px;
                display: block; }
            .login-wrapper .social-icons {
                justify-content: center; }
                .login-wrapper .social-icons li {
                    margin-left: 5px;
                    margin-right: 5px; }
            .login-wrapper .login-aside-left {
                text-align: center;
                width: 100%;
                display: block; }
            .login-wrapper .authincation-content {
                padding: 30px 10px; } }
        @media only screen and (max-width: 575px) {
            .login-wrapper .login-aside-left {
                padding: 50px 30px; }
                .login-wrapper .login-aside-left .login-description {
                    padding-bottom: 0; }
            .login-wrapper h2, .login-wrapper .h2, .login-wrapper .h2 {
                font-size: 1.5rem; }
            .login-wrapper h4, .login-wrapper .h4, .login-wrapper .h4 {
                font-size: 0.8rem; } }

    .facebook__btn,
    .twitter__btn,
    .google__btn,
    .github__btn {
        display: block;
        width: 90%;
        max-width: 680px;
        margin: 5px auto;
        height: 50px;
        cursor: pointer;
        font-size: 14px;
        font-family: 'Montserrat', sans-serif;
        border-radius: 8px;
        border: none;
        line-height: 20px;

        &.google__btn {
            background: #DB4437;
            color: white;
            box-shadow: 0 15px 30px rgba(#DB4437, .36);
            transition: .2s linear;

            .fa {
                font-size: 20px;
                // padding: 0 5px 0 0;
            }

            &:hover {
                box-shadow: 0 0 0 rgba(#DB4437, .0);
            }
        }
        &.github__btn {
            background: #25282d;
            color: white;
            box-shadow: 0 15px 30px rgba(#25282d, .36);
            transition: .2s linear;

            .fa {
                font-size: 20px;
                // padding: 0 5px 0 0;
            }

            &:hover {
                box-shadow: 0 0 0 rgba(#25282d, .0);
            }
        }
        &.twitter__btn {
            background: #1DA1F2;
            color: white;
            box-shadow: 0 15px 30px rgba(#1DA1F2, .36);
            transition: .2s linear;

            .fa {
                font-size: 20px;
                // padding: 0 5px 0 0;
            }

            &:hover {
                box-shadow: 0 0 0 rgba(#1DA1F2, .0);
            }
        }
        &.facebook__btn {
            background: #4267B2;
            color: white;
            box-shadow: 0 15px 30px rgba(#4267B2, .36);
            transition: .2s linear;

            .fa {
                font-size: 20px;
                // padding: 0 5px 0 0;
            }

            &:hover {
                box-shadow: 0 0 0 rgba(#4267B2, .0);
            }
        }
    }
</style>