<template>
    <div class="footer">
        <p>个人Github地址: <a href="https://github.com/zd-1208298216">https://github.com/zd-1208298216</a></p>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .footer {
        height: 80px;
        background: #1DA7DA;
        // margin-bottom: 0px;
        p {
            line-height: 80px;
            width: 100%;
            text-align: center;
            color: white;
            a {
                text-decoration: none;
                color: white;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>