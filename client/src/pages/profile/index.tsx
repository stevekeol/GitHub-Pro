import Taro, { Component, Config, useState, useEffect } from "@tarojs/taro"
import { View, Image } from "@tarojs/components"
import { AtTabs, AtTabsPane } from "taro-ui"

import "./index.scss"
import NavBar from "../../components/navbar"
import { getGlobalData, setGlobalData } from "../../utils/global_data"
import { IUserInfo } from "src/services/user"
import { getCurrentUser, IUserOrg, getUserOrgs } from "../../services/user"
import Empty from "../../components/empty"

import Info from "./info/index"
import Activity from "./activity/index"
import Starred from "./starred/index"

const tabList = [{ title: "info" }, { title: "activity" }, { title: "starred" }]

const Profile = () => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null)
  const [userOrgs, setUserOrgs] = useState<IUserOrg[] | null>(null)
  const [currTab, setCurrTab] = useState<number>(0)

  useEffect(() => {
    getCurrentUser().then(data => {
      if (data) {
        setUserInfo(data)
        setGlobalData("userInfo", data)
      }
    })
  }, [])

  useEffect(() => {
    if (userInfo) {
      getUserOrgs(userInfo.login).then(data => {
        if (data) {
          setUserOrgs(data)
        }
      })
    }
  }, [userInfo])

  const handleTabClick = val => {
    setCurrTab(val)
  }

  const renderUserInfo = () => {
    const {
      login,
      id,
      node_id,
      avatar_url,
      gravatar_id,
      url,
      html_url,
      followers_url,
      following_url,
      gists_url,
      starred_url,
      subscriptions_url,
      organizations_url,
      repos_url,
      events_url,
      received_events_url,
      type,
      site_admin,
      name,
      company,
      blog,
      location,
      email,
      hireable,
      bio,
      public_repos,
      public_gists,
      followers,
      following,
      created_at,
      updated_at
    } = userInfo!
    return (
      <View>
        <View className="header">
          <Image src={avatar_url}></Image>
          <View>
            <View>{login}</View>
            <View>{location}</View>
            <View>Joined at {new Date(created_at).toDateString()}</View>
          </View>
        </View>
        <View>
          <AtTabs current={currTab} tabList={tabList} onClick={handleTabClick}>
            <AtTabsPane current={currTab} index={0}>
              <View>
                <Info userInfo={userInfo} userOrgs={userOrgs}></Info>
              </View>
            </AtTabsPane>
            <AtTabsPane current={currTab} index={1}>
              <View>
                <Activity></Activity>
              </View>
            </AtTabsPane>
            <AtTabsPane current={currTab} index={2}>
              <View>
                <Starred></Starred>
              </View>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    )
  }

  return (
    <View>
      <NavBar isGoBackBtn></NavBar>
      {userInfo ? renderUserInfo() : <Empty></Empty>}
    </View>
  )
}

export default Profile